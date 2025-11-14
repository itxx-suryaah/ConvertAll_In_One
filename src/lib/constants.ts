
import {
  type LucideIcon,
  Minimize,
  ScanFace,
  FolderSync,
  FolderGit2,
  File,
} from "lucide-react";

export type Tool = {
  name: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

export const TOOLS: Tool[] = [
  {
    name: "Image Compression",
    description: "Compress images with various presets and custom settings.",
    href: "/compress",
    icon: Minimize,
  },
  {
    name: "Folder Compression",
    description: "Compress multiple images or entire folders.",
    href: "/compress-folder",
    icon: FolderSync,
  },
  {
    name: "File Conversion",
    description: "Convert individual files between various formats.",
    href: "/convert",
    icon: File,
  },
  {
    name: "Folder Conversion",
    description: "Convert batches of files and entire folders.",
    href: "/convert-folder",
    icon: FolderGit2,
  },
  {
    name: "Passport Size Photo Maker",
    description: "Resize images to passport dimensions with AI auto-centering.",
    href: "/passport-photo",
    icon: ScanFace,
  },
];
