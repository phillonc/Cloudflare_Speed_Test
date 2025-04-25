"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { formatDistance } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { 
  ArrowUpDown, 
  RefreshCw, 
  Clock, 
  Shield,
  FileJson,
  Map as MapIcon,
  Download,
  Upload,
  Percent,
  FileDown
} from "lucide-react";
import { type TestResult } from "@/lib/types";
import { getColorByResponseTime, formatTime, groupResultsByRegion } from "@/lib/utils";
import { downloadResults } from "@/lib/api";

interface TestResultsProps {
  results: TestResult[];
  url: string;
  onReset: () => void;
}

export function TestResults({ results, url, onReset }: TestResultsProps) {
  const [activeTab, setActiveTab] = useState("summary");
  
  const startTime = results[0]?.timestamp || new Date();
  const isCloudflare = results.some(result => result.cloudflare);
  
  // Calculate averages
  const responseTimes = results.map(result => result.responseTime).filter(time => time !== null) as number[];
  const avgResponseTime = responseTimes.length > 0
    ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length
    : 0;
  
  const packetLosses = results.map(result => result.packetLoss).filter(loss => loss !== null) as number[];
  const avgPacketLoss = packetLosses.length > 0
    ? packetLosses.reduce((sum, loss) => sum + loss, 0) / packetLosses.length
    : 0;
  
  const downloads = results.map(result => result.download).filter(speed => speed !== null) as number[];
  const avgDownload = downloads.length > 0
    ? downloads.reduce((sum, speed) => sum + speed, 0) / downloads.length
    : 0;
  
  const uploads = results.map(result => result.upload).filter(speed => speed !== null) as number[];
  const avgUpload = uploads.length > 0
    ? uploads.reduce((sum, speed) => sum + speed, 0) / uploads.length
    : 0;
  
  // Prepare chart data
  const chartData = groupResultsByRegion(results);
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="summary">
            <FileJson className="h-4 w-4 mr-2" />
            Summary
          </TabsTrigger>
          <TabsTrigger value="map">
            <MapIcon className="h-4 w-4 mr-2" />
            Map View
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Test Summary</CardTitle>
              <CardDescription>
                Test results for {url}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-muted p-4 rounded-lg">
                  <div className="text-sm text-muted-foreground">URL Tested</div>
                  <div className="font-medium text-sm truncate mt-1">{url}</div>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <div className="text-sm text-muted-foreground">Test Started</div>
                  <div className="font-medium mt-1">
                    {formatDistance(startTime, new Date(), { addSuffix: true })}
                  </div>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <div className="text-sm text-muted-foreground">Average Response Time</div>
                  <div className="font-medium mt-1">{formatTime(avgResponseTime)}</div>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <div className="text-sm text-muted-foreground">Cloudflare Detected</div>
                  <div className="font-medium mt-1">
                    {isCloudflare ? (
                      <span className="text-green-500 flex items-center">
                        <Shield className="h-4 w-4 mr-1" /> Yes
                      </span>
                    ) : (
                      <span className="text-muted-foreground">No</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-muted p-4 rounded-lg">
                  <div className="text-sm text-muted-foreground flex items-center">
                    <Percent className="h-4 w-4 mr-1" />
                    Average Packet Loss
                  </div>
                  <div className="font-medium mt-1">{avgPacketLoss.toFixed(2)}%</div>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <div className="text-sm text-muted-foreground flex items-center">
                    <Download className="h-4 w-4 mr-1" />
                    Average Download Speed
                  </div>
                  <div className="font-medium mt-1">{avgDownload.toFixed(2)} Mbps</div>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <div className="text-sm text-muted-foreground flex items-center">
                    <Upload className="h-4 w-4 mr-1" />
                    Average Upload Speed
                  </div>
                  <div className="font-medium mt-1">{avgUpload.toFixed(2)} Mbps</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Response Times by Region</h3>
                <div className="aspect-[2/1] w-full bg-muted/50 rounded-lg p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <XAxis 
                        dataKey="region" 
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        tickFormatter={(value) => `${value}ms`}
                      />
                      <Tooltip 
                        formatter={(value) => [`${value}ms`, 'Response Time']}
                        contentStyle={{
                          backgroundColor: 'var(--background)',
                          border: '1px solid var(--border)',
                          borderRadius: '0.5rem',
                          fontSize: '0.875rem',
                        }}
                      />
                      <Bar dataKey="avgTime" name="Response Time">
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={getColorByResponseTime(entry.avgTime)} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Detailed Results</CardTitle>
              <CardDescription>
                Individual test results from each location
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {results
                    .sort((a, b) => (a.responseTime || 9999) - (b.responseTime || 9999))
                    .map((result, index) => (
                      <div key={index} className="p-4 bg-muted/50 rounded-lg">
                        <div className="flex flex-col space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{result.agent.name}</h4>
                              <div className="text-sm text-muted-foreground">
                                {result.agent.region}
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-2 items-center">
                              {result.responseTime ? (
                                <Badge 
                                  variant="outline" 
                                  className="flex items-center" 
                                  style={{ 
                                    backgroundColor: getColorByResponseTime(result.responseTime, 0.1),
                                    color: getColorByResponseTime(result.responseTime, 1),
                                  }}
                                >
                                  <Clock className="h-3 w-3 mr-1" />
                                  {formatTime(result.responseTime)}
                                </Badge>
                              ) : (
                                <Badge variant="destructive">Failed</Badge>
                              )}
                              
                              {result.cloudflare && (
                                <Badge 
                                  variant="outline" 
                                  className="bg-green-500/10 text-green-500 border-green-200 dark:border-green-800"
                                >
                                  <Shield className="h-3 w-3 mr-1" />
                                  Cloudflare
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          {!result.error && (
                            <div className="grid grid-cols-3 gap-4 mt-2">
                              <div className="text-sm">
                                <span className="text-muted-foreground flex items-center">
                                  <Percent className="h-3 w-3 mr-1" />
                                  Packet Loss
                                </span>
                                <span className="font-medium">
                                  {result.packetLoss?.toFixed(2)}%
                                </span>
                              </div>
                              <div className="text-sm">
                                <span className="text-muted-foreground flex items-center">
                                  <Download className="h-3 w-3 mr-1" />
                                  Download
                                </span>
                                <span className="font-medium">
                                  {result.download?.toFixed(2)} Mbps
                                </span>
                              </div>
                              <div className="text-sm">
                                <span className="text-muted-foreground flex items-center">
                                  <Upload className="h-3 w-3 mr-1" />
                                  Upload
                                </span>
                                <span className="font-medium">
                                  {result.upload?.toFixed(2)} Mbps
                                </span>
                              </div>
                            </div>
                          )}
                          
                          {result.error && (
                            <div className="mt-2 text-sm text-destructive">
                              Error: {result.error}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter className="flex gap-4">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => downloadResults(results)}
              >
                <FileDown className="h-4 w-4 mr-2" />
                Download Results
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={onReset}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Run New Test
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="map">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Map View</CardTitle>
              <CardDescription>
                Visual representation of test results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted h-[500px] w-full relative rounded-md">
                <div className="absolute inset-0 bg-world-map bg-no-repeat bg-center bg-contain opacity-70 dark:opacity-50"></div>
                
                {results.map((result, index) => {
                  const [lat, lng] = result.agent.coordinates.split(",").map(Number);
                  return (
                    <div
                      key={index}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                      style={{
                        top: `${(90 - lat) * (100 / 180)}%`,
                        left: `${(lng + 180) * (100 / 360)}%`,
                      }}
                    >
                      <div 
                        className={`h-5 w-5 rounded-full flex items-center justify-center transition-all duration-300 ${
                          result.error ? 'bg-destructive/20' : (
                            result.responseTime ? 
                              'bg-primary/20' : 
                              'bg-muted'
                          )
                        }`}
                        style={
                          result.responseTime ? {
                            backgroundColor: `${getColorByResponseTime(result.responseTime, 0.2)}`,
                          } : {}
                        }
                      >
                        <div 
                          className={`h-3 w-3 rounded-full ${
                            result.error ? 'bg-destructive' : (
                              result.responseTime ? 'bg-primary' : 'bg-muted-foreground'
                            )
                          }`}
                          style={
                            result.responseTime ? {
                              backgroundColor: getColorByResponseTime(result.responseTime),
                            } : {}
                          }
                        ></div>
                      </div>
                      
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                        <div className="bg-popover text-popover-foreground shadow-md rounded-md p-2 text-sm whitespace-nowrap min-w-40">
                          <p className="font-medium">{result.agent.name}</p>
                          {result.responseTime ? (
                            <>
                              <p className="text-xs mt-1">Response time: {formatTime(result.responseTime)}</p>
                              <p className="text-xs">Packet Loss: {result.packetLoss?.toFixed(2)}%</p>
                              <p className="text-xs">Download: {result.download?.toFixed(2)} Mbps</p>
                              <p className="text-xs">Upload: {result.upload?.toFixed(2)} Mbps</p>
                            </>
                          ) : (
                            <p className="text-xs text-destructive mt-1">Failed</p>
                          )}
                          {result.cloudflare && (
                            <div className="mt-1 flex items-center text-xs text-green-500">
                              <Shield className="h-3 w-3 mr-1" />
                              Cloudflare detected
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
            <CardFooter className="flex gap-4">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => downloadResults(results)}
              >
                <FileDown className="h-4 w-4 mr-2" />
                Download Results
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={onReset}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Run New Test
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}