
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Download, Loader2, X, Settings } from "lucide-react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

import { ToolHeader } from "../../../components/tool-header";
import { FileDropzone } from "../../../components/file-dropzone";
import { TOOLS } from "../../../lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Slider } from "../../../components/ui/slider";
import { Label } from "../../../components/ui/label";
import { Button } from "../../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Badge } from "../../../components/ui/badge";
import { Input } from "../../../components/ui/input";
import { useToast } from "../../../hooks/use-toast";
import { compressImage } from "../../../lib/image-compression";

type ProcessedFile = {
  id: string;
  file: File;
  previewUrl: string;
  originalSize: number;
  compressedSize: number;
  quality: number;
  outputFormat: string;
  outputName: string;
};

export default function CompressPage() {
  const tool = TOOLS.find((t) => t.href === "/compress")!;
  const [files, setFiles] = useState<File[]>([]);
  const [processedFiles, setProcessedFiles] = useState<ProcessedFile[]>([]);
  const [quality, setQuality] = useState(80);
  const [outputFormat, setOutputFormat] = useState("jpeg");
  const [isCompressing, setIsCompressing] = useState(false);
  const { toast } = useToast();

  const handleFileAdded = (newFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };
  
  useEffect(() => {
    // This effect runs when the source files, quality, or format changes.
    // It re-calculates the processed files array.
    if (files.length > 0) {
      setProcessedFiles(currentProcessed => {
        const fileMap = new Map(currentProcessed.map(f => [f.file.name, f]));

        return files.map(file => {
          const existing = fileMap.get(file.name);
          const compressedSize = (file.size) * (quality / 100);
          const nameWithoutExtension = file.name.split('.').slice(0, -1).join('.');

          return {
            id: existing?.id || `${file.name}-${Date.now()}`,
            file,
            previewUrl: existing?.previewUrl || URL.createObjectURL(file),
            originalSize: file.size,
            compressedSize: compressedSize,
            quality,
            outputFormat,
            // Preserve existing name on re-renders, otherwise set initial name
            outputName: existing?.outputName || nameWithoutExtension || 'compressed-image',
          };
        });
      });
    } else {
      processedFiles.forEach(f => URL.revokeObjectURL(f.previewUrl));
      setProcessedFiles([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files, quality, outputFormat]);


  const handleOutputNameChange = (id: string, newName: string) => {
    setProcessedFiles(prev => 
      prev.map(pf => pf.id === id ? { ...pf, outputName: newName } : pf)
    );
  };

  const totalOriginalSize = processedFiles.reduce((acc, f) => acc + f.originalSize, 0);
  const totalCompressedSize = processedFiles.reduce((acc, f) => acc + f.compressedSize, 0);
  const totalSaved = totalOriginalSize > 0 ? ((totalOriginalSize - totalCompressedSize) / totalOriginalSize) * 100 : 0;


  const handleDownload = async () => {
    if (processedFiles.length === 0) return;
    setIsCompressing(true);
    toast({ title: "Compressing images...", description: `Processing ${processedFiles.length} files. Please wait.` });

    try {
        if (processedFiles.length === 1) {
            const pFile = processedFiles[0];
            const blob = await compressImage(pFile.file, pFile.quality / 100, `image/${pFile.outputFormat}`);
            if (blob) {
                saveAs(blob, `${pFile.outputName}.${pFile.outputFormat}`);
                toast({ title: "Compression complete!", description: "Your image has been downloaded." });
            }
        } else {
            const zip = new JSZip();
            for (const pFile of processedFiles) {
                const blob = await compressImage(pFile.file, pFile.quality / 100, `image/${pFile.outputFormat}`);
                if (blob) {
                    zip.file(`${pFile.outputName}.${pFile.outputFormat}`, blob);
                }
            }
            const zipBlob = await zip.generateAsync({ type: 'blob' });
            saveAs(zipBlob, 'compressed-images.zip');
            toast({ title: "Compression complete!", description: "Your ZIP file has been downloaded." });
        }
    } catch (error) {
        console.error("Error during compression:", error);
        toast({ variant: 'destructive', title: "Error", description: "Could not compress and download the files." });
    } finally {
        setIsCompressing(false);
    }
  };

  const handleClearAll = () => {
    setFiles([]);
    setProcessedFiles([]);
  };
  
  const handleRemoveFile = (fileName: string) => {
    setFiles(files.filter(f => f.name !== fileName));
  };


  return (
    <div className="w-full">
      <ToolHeader title={tool.name} description={tool.description} />
      {processedFiles.length === 0 ? (
        <FileDropzone onFilesAdded={handleFileAdded} multiple />
      ) : (
        <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {processedFiles.map((p) => (
                    <Card key={p.id} className="group relative">
                        <CardContent className="p-0">
                            <div className="aspect-square relative">
                                <Image src={p.previewUrl} alt={p.file.name} fill className="object-cover rounded-t-lg"/>
                            </div>
                            <div className="p-3 text-xs">
                                <p className="font-semibold truncate">{p.file.name}</p>
                                <p className="text-muted-foreground">
                                    <span className="line-through">{(p.originalSize / 1024).toFixed(1)} KB</span>
                                    <span className="font-bold text-foreground"> {(p.compressedSize / 1024).toFixed(1)} KB</span>
                                </p>
                            </div>
                             <Button
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => handleRemoveFile(p.file.name)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                        </CardContent>
                    </Card>
                ))}
                 <FileDropzone onFilesAdded={handleFileAdded} multiple className="min-h-[200px]" />
            </div>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                    <Settings className="w-5 h-5"/>
                    <CardTitle className="text-lg">Compression Settings</CardTitle>
                    <Badge variant="secondary" className="ml-2">{processedFiles.length} completed</Badge>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="success" onClick={handleDownload} disabled={isCompressing}>
                        {isCompressing ? <Loader2 className="w-4 h-4 mr-2 animate-spin"/> : <Download className="w-4 h-4 mr-2"/>}
                        {isCompressing ? 'Compressing...' : 'Download All'}
                    </Button>
                    <Button variant="ghost" onClick={handleClearAll} disabled={isCompressing}><X className="w-4 h-4 mr-2"/>Clear All</Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                    <div>
                        <Label htmlFor="output-format">Output Format</Label>
                        <Select
                          value={outputFormat}
                          onValueChange={setOutputFormat}
                        >
                          <SelectTrigger id="output-format" className="bg-muted/50">
                            <SelectValue placeholder="Select format" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="jpeg">JPEG</SelectItem>
                            <SelectItem value="png">PNG</SelectItem>
                            <SelectItem value="webp">WebP</SelectItem>
                            <SelectItem value="avif">AVIF</SelectItem>
                          </SelectContent>
                        </Select>
                    </div>
                    <div>
                      <Label htmlFor="quality-slider">Quality: {quality}</Label>
                      <Slider
                        id="quality-slider"
                        min={0}
                        max={100}
                        step={1}
                        value={[quality]}
                        onValueChange={(value) => setQuality(value[0])}
                      />
                  </div>
                </div>

                {processedFiles.length === 1 && (
                  <div>
                    <Label htmlFor="rename-file">Rename File</Label>
                    <Input
                      id="rename-file"
                      value={processedFiles[0].outputName}
                      onChange={(e) => handleOutputNameChange(processedFiles[0].id, e.target.value)}
                      placeholder="Enter new filename"
                    />
                  </div>
                )}
                
                <div className="grid grid-cols-3 gap-4 text-center mt-4 p-4 rounded-lg bg-muted/30">
                    <div>
                        <p className="text-sm text-muted-foreground">Total Original</p>
                        <p className="text-lg font-bold">{(totalOriginalSize / 1024).toFixed(2)} KB</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Total Compressed</p>
                        <p className="text-lg font-bold">{(totalCompressedSize / 1024).toFixed(2)} KB</p>
                    </div>
                     <div>
                        <p className="text-sm text-muted-foreground">Total Saved</p>
                        <div className="flex items-center justify-center gap-2">
                            <Badge variant="gradient" className="text-lg">{totalSaved.toFixed(0)}%</Badge>
                        </div>
                    </div>
                </div>
              </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}

    