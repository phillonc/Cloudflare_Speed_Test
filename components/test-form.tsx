"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe, Network } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type Agent } from "@/lib/types";

interface TestFormProps {
  agents: Agent[];
  selectedAgents: string[];
  onAgentSelection: (agents: string[]) => void;
  onStartTest: (url: string) => void;
  isLoading: boolean;
}

export function TestForm({ 
  agents, 
  selectedAgents, 
  onAgentSelection, 
  onStartTest,
  isLoading 
}: TestFormProps) {
  const [url, setUrl] = useState("https://cloudflare.com");
  const [selectedContinent, setSelectedContinent] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [filteredAgents, setFilteredAgents] = useState<Agent[]>([]);

  // Extract unique continents and countries
  const continents = [...new Set(agents.map(agent => agent.continent))];
  const countries = [...new Set(agents
    .filter(agent => !selectedContinent || agent.continent === selectedContinent)
    .map(agent => agent.country))];

  // Update filtered agents when filters change
  useEffect(() => {
    let filtered = agents;
    
    if (selectedContinent) {
      filtered = filtered.filter(agent => agent.continent === selectedContinent);
    }
    
    if (selectedCountry) {
      filtered = filtered.filter(agent => agent.country === selectedCountry);
    }
    
    setFilteredAgents(filtered);
  }, [agents, selectedContinent, selectedCountry]);

  const handleSelectAll = () => {
    if (filteredAgents.length === selectedAgents.length) {
      onAgentSelection([]);
    } else {
      onAgentSelection(filteredAgents.map(agent => agent.id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAgents.length === 0) return;
    onStartTest(url);
  };

  const handleAgentToggle = (agentId: string) => {
    if (selectedAgents.includes(agentId)) {
      onAgentSelection(selectedAgents.filter(id => id !== agentId));
    } else {
      onAgentSelection([...selectedAgents, agentId]);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Test Configuration</CardTitle>
          <CardDescription>Enter the URL to test and select server locations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="url">URL to Test</Label>
            <div className="flex">
              <div className="bg-muted flex items-center justify-center px-3 rounded-l-md border border-r-0 border-input">
                <Globe className="h-4 w-4 text-muted-foreground" />
              </div>
              <Input
                id="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="rounded-l-none"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Filter Locations</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                value={selectedContinent || "all"}
                onValueChange={(value) => setSelectedContinent(value === "all" ? null : value)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Continents" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Continents</SelectItem>
                  {continents.map((continent) => (
                    <SelectItem key={continent} value={continent}>
                      {continent.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={selectedCountry || "all"}
                onValueChange={(value) => setSelectedCountry(value === "all" ? null : value)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Countries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Test Locations</Label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={handleSelectAll}
                disabled={isLoading || filteredAgents.length === 0}
              >
                {filteredAgents.length === selectedAgents.length ? "Deselect All" : "Select All"}
              </Button>
            </div>
            
            <ScrollArea className="h-[200px] border rounded-md p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredAgents.map((agent) => (
                  <div key={agent.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`agent-${agent.id}`}
                      checked={selectedAgents.includes(agent.id)}
                      onCheckedChange={() => handleAgentToggle(agent.id)}
                    />
                    <Label
                      htmlFor={`agent-${agent.id}`}
                      className="text-sm cursor-pointer"
                    >
                      {agent.name}
                    </Label>
                  </div>
                ))}
                {filteredAgents.length === 0 && (
                  <div className="col-span-full text-center py-8 text-muted-foreground">
                    No locations found with current filters
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            {selectedAgents.length} locations selected
          </div>
          <Button 
            type="submit" 
            disabled={isLoading || selectedAgents.length === 0}
          >
            <Network className="mr-2 h-4 w-4" />
            Start Tests
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}