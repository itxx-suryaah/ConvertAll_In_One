
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Combine, X } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { TOOLS } from "@/lib/constants";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

function DesktopNav({ pathname }: { pathname: string | null }) {
  return (
    <nav className="hidden md:flex items-center justify-center">
      <div className="flex items-center gap-x-1 rounded-full bg-card/80 border border-border/60 p-1 backdrop-blur-lg shadow-sm">
        {TOOLS.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className={cn(
              "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-all duration-200 hover:text-foreground hover:bg-accent/50",
              pathname === tool.href &&
                "bg-[#F5F5DC] text-black shadow-md border border-[#E6E1C5]"
            )}
          >
            <tool.icon className="h-4 w-4 text-black" />
            <span>{tool.name}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

function MobileNav({
  pathname,
  isOpen,
  setIsOpen,
}: {
  pathname: string | null;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
  return (
    <div className="md:hidden">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-20">
  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M12 17.25h8.25" />
</svg>

            <span className="sr-only">Open Menu</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-[#F5F5DC] text-black border border-[#E6E1C5] shadow-md">
          <DialogHeader>
            <DialogTitle>
              <Link
                href="/"
                className="flex items-center space-x-2"
                onClick={() => setIsOpen(false)}
              >
                <Combine className="h-6 w-6 text-black" />
                <span className="font-bold">Convert All In One</span>
              </Link>
            </DialogTitle>



              <span className="sr-only">Close</span>

          </DialogHeader>
          <nav className="mt-6 flex flex-col space-y-1">
            {TOOLS.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium text-muted-foreground transition-all duration-200 hover:text-foreground hover:bg-accent/50",
                  pathname === tool.href && "bg-[#FFFF] text-black border border-[#E6E1C5] shadow-md"
                )}
              >
                <tool.icon className="h-5 w-5 text-black" />
                <span>{tool.name}</span>
              </Link>
            ))}
          </nav>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function Header() {
  const pathname = usePathname();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 md:h-20 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center flex-shrink-0">
          <Link href="/" className="flex items-center space-x-2">
            <Combine className="h-5 w-5 md:h-6 md:w-6 text-black" />
            <span className="hidden sm:inline-block font-bold text-base md:text-lg">
              Convert All In One
            </span>
          </Link>
        </div>

        <div className="hidden md:flex flex-1 justify-center items-center">
           <DesktopNav pathname={pathname} />
        </div>

        <div className="flex items-center justify-end md:flex-none">
          <MobileNav
            pathname={pathname}
            isOpen={isSheetOpen}
            setIsOpen={setIsSheetOpen}
          />
        </div>
      </div>
    </header>
  );
}
