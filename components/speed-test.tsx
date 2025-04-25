"use client";

import React, { useState, useEffect } from "react";
import { WorldMap } from "@/components/world-map";
import { TestForm } from "@/components/test-form";
import { TestProgress } from "@/components/test-progress";
import { TestResults } from "@/components/test-results";
import { type Agent, type TestResult } from "@/lib/types";
import { fetchAgents, runTests } from "@/lib/api";

export function SpeedTest() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTesting, setIsTesting] = useState(false);
  const [testUrl, setTestUrl] = useState("");
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [progress, setProgress] = useState(0);

  // Load agents only once when component mounts
  useEffect(() => {
    const loadAgents = async () => {
      try {
        const data = await fetchAgents();
        setAgents(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load agents:", error);
        setIsLoading(false);
      }
    };

    loadAgents();
  }, []); // Empty dependency array means this runs once on mount

  const handleAgentSelection = (agentIds: string[]) => {
    setSelectedAgents(agentIds);
  };

  const handleStartTest = async (url: string) => {
    if (selectedAgents.length === 0) {
      return;
    }

    setTestUrl(url);
    setIsTesting(true);
    setProgress(0);
    setTestResults([]);

    try {
      await runTests(url, selectedAgents, {
        onProgress: (completed, total) => {
          setProgress(Math.floor((completed / total) * 100));
        },
        onResult: (result) => {
          setTestResults((prev) => [...prev, result]);
        },
      });
    } catch (error) {
      console.error("Test failed:", error);
    } finally {
      setIsTesting(false);
    }
  };

  const handleReset = () => {
    setTestResults([]);
    setProgress(0);
  };

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Cloudflare Speed Test</h1>
        <p className="text-muted-foreground text-lg">
          Test performance of Cloudflare servers across the world
        </p>
      </header>

      <div className="grid gap-8 grid-cols-1">
        {!isTesting && testResults.length === 0 && (
          <>
            <WorldMap 
              agents={agents} 
              selectedAgents={selectedAgents}
              onAgentSelection={handleAgentSelection}
              isLoading={isLoading}
            />
            <TestForm 
              agents={agents}
              selectedAgents={selectedAgents}
              onAgentSelection={handleAgentSelection}
              onStartTest={handleStartTest}
              isLoading={isLoading}
            />
          </>
        )}

        {isTesting && (
          <TestProgress 
            progress={progress} 
            completedTests={testResults.length}
            totalTests={selectedAgents.length}
          />
        )}

        {!isTesting && testResults.length > 0 && (
          <TestResults 
            results={testResults} 
            url={testUrl}
            onReset={handleReset}
          />
        )}
      </div>
    </div>
  );
}