"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface TestProgressProps {
  progress: number;
  completedTests: number;
  totalTests: number;
}

export function TestProgress({ progress, completedTests, totalTests }: TestProgressProps) {
  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>Test in Progress</CardTitle>
        <CardDescription>Testing server locations, please wait</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={progress} className="h-2" />
        <div className="text-sm text-muted-foreground text-center">
          {completedTests} of {totalTests} tests completed
        </div>
        
        <div className="pt-4 flex justify-center">
          <div className="animate-pulse flex space-x-3">
            <div className="h-2 w-2 bg-primary rounded-full"></div>
            <div className="h-2 w-2 bg-primary rounded-full animation-delay-200"></div>
            <div className="h-2 w-2 bg-primary rounded-full animation-delay-400"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}