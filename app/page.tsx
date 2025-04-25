"use client";

import { useState } from "react";
import { SpeedTest } from "@/components/speed-test";
import { ThemeProvider } from "@/components/theme-provider";

export default function Home() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <main className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto px-4 py-8">
          <SpeedTest />
        </div>
      </main>
    </ThemeProvider>
  );
}