import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { TestResult, RegionData } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Get color based on response time
export function getColorByResponseTime(time: number, opacity: number = 1): string {
  if (!time) return `rgba(156, 163, 175, ${opacity})`; // gray-400
  
  if (time < 100) {
    return `rgba(16, 185, 129, ${opacity})`; // green-500
  } else if (time < 300) {
    return `rgba(59, 130, 246, ${opacity})`; // blue-500
  } else if (time < 600) {
    return `rgba(245, 158, 11, ${opacity})`; // yellow-500
  } else {
    return `rgba(239, 68, 68, ${opacity})`; // red-500
  }
}

// Format time in milliseconds to human readable format
export function formatTime(time: number | null): string {
  if (time === null) return 'Failed';
  
  if (time < 1000) {
    return `${time.toFixed(0)}ms`;
  } else {
    return `${(time / 1000).toFixed(2)}s`;
  }
}

// Group test results by region for charting
export function groupResultsByRegion(results: TestResult[]): RegionData[] {
  const regionMap = new Map<string, { total: number; count: number }>();
  
  results.forEach(result => {
    if (result.responseTime !== null) {
      const region = result.agent.region;
      
      if (!regionMap.has(region)) {
        regionMap.set(region, { total: 0, count: 0 });
      }
      
      const current = regionMap.get(region)!;
      current.total += result.responseTime;
      current.count += 1;
    }
  });
  
  return Array.from(regionMap.entries()).map(([region, data]) => ({
    region,
    avgTime: Math.round(data.total / data.count),
    count: data.count,
  }));
}