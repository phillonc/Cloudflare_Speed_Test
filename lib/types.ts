export interface Coordinates {
  x: number;
  y: number;
}

export interface Agent {
  id: string;
  name: string;
  url: string;
  continent: string;
  country: string;
  region: string;
  coordinates: string; // "lat,lng" format
}

export interface TestResult {
  agent: Agent;
  responseTime: number | null;
  cloudflare: boolean;
  timestamp: Date;
  headers?: Record<string, string>;
  error?: string;
  packetLoss?: number;
  download?: number;
  upload?: number;
}

export interface TestOptions {
  onProgress?: (completed: number, total: number) => void;
  onResult?: (result: TestResult) => void;
}

export interface RegionData {
  region: string;
  avgTime: number;
  count: number;
}