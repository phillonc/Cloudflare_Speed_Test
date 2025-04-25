import { Agent, TestResult, TestOptions } from "@/lib/types";
import { agentData } from "@/lib/test-data";

// In a real application, this would be an API call
export async function fetchAgents(): Promise<Agent[]> {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 1000));
  return agentData;
}

// Simulate test to an endpoint
export async function runTests(
  url: string, 
  agentIds: string[], 
  options?: TestOptions
): Promise<TestResult[]> {
  const agents = await fetchAgents();
  const selectedAgents = agents.filter(agent => agentIds.includes(agent.id));
  const results: TestResult[] = [];
  
  let completed = 0;
  const total = selectedAgents.length;
  
  // Run tests in parallel
  const testPromises = selectedAgents.map(async (agent) => {
    try {
      // Simulate network request
      const delay = Math.random() * 3000 + 50; // Random between 50ms and 3050ms
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // 5% chance of failure
      const shouldFail = Math.random() < 0.05;
      
      let result: TestResult;
      
      if (shouldFail) {
        result = {
          agent,
          responseTime: null,
          cloudflare: false,
          timestamp: new Date(),
          error: "Connection timed out",
          packetLoss: null,
          download: null,
          upload: null,
        };
      } else {
        const responseTime = Math.floor(delay);
        // 70% chance of cloudflare detection for realism
        const cloudflareDetected = Math.random() < 0.7;
        
        // Simulate packet loss (0-5%)
        const packetLoss = Math.random() * 5;
        
        // Simulate download/upload speeds (1-1000 Mbps)
        const download = Math.random() * 1000;
        const upload = Math.random() * 1000;
        
        result = {
          agent,
          responseTime,
          cloudflare: cloudflareDetected,
          timestamp: new Date(),
          headers: {
            "content-type": "text/html",
            "server": cloudflareDetected ? "cloudflare" : "nginx",
            "date": new Date().toUTCString(),
          },
          packetLoss,
          download,
          upload,
        };
      }
      
      // Update progress
      completed++;
      options?.onProgress?.(completed, total);
      
      // Send result
      options?.onResult?.(result);
      
      return result;
    } catch (error) {
      const result: TestResult = {
        agent,
        responseTime: null,
        cloudflare: false,
        timestamp: new Date(),
        error: "Network error",
        packetLoss: null,
        download: null,
        upload: null,
      };
      
      // Update progress
      completed++;
      options?.onProgress?.(completed, total);
      
      // Send result
      options?.onResult?.(result);
      
      return result;
    }
  });
  
  return Promise.all(testPromises);
}

export function downloadResults(results: TestResult[]) {
  const data = results.map(result => ({
    location: result.agent.name,
    region: result.agent.region,
    responseTime: result.responseTime ? `${result.responseTime}ms` : 'Failed',
    packetLoss: result.packetLoss ? `${result.packetLoss.toFixed(2)}%` : 'N/A',
    download: result.download ? `${result.download.toFixed(2)} Mbps` : 'N/A',
    upload: result.upload ? `${result.upload.toFixed(2)} Mbps` : 'N/A',
    cloudflare: result.cloudflare ? 'Yes' : 'No',
    timestamp: result.timestamp.toISOString(),
    error: result.error || 'None'
  }));

  const csv = [
    Object.keys(data[0]).join(','),
    ...data.map(row => Object.values(row).map(value => `"${value}"`).join(','))
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('hidden', '');
  a.setAttribute('href', url);
  a.setAttribute('download', `speedtest-results-${new Date().toISOString()}.csv`);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}