"use client";

import { useState, useCallback } from "react";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { type Agent } from "@/lib/types";
import { MapPin, AlertCircle, RefreshCw } from "lucide-react";

interface WorldMapProps {
  agents: Agent[];
  selectedAgents: string[];
  onAgentSelection: (agents: string[]) => void;
  isLoading: boolean;
}

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 30,
  lng: 0,
};

const options = {
  minZoom: 2,
  maxZoom: 8,
  styles: [
    {
      featureType: "all",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "administrative.country",
      elementType: "geometry.stroke",
      stylers: [{ visibility: "on" }],
    },
    {
      featureType: "water",
      elementType: "geometry.fill",
      stylers: [{ color: "#1e293b" }],
    },
    {
      featureType: "landscape",
      elementType: "geometry.fill",
      stylers: [{ color: "#0f172a" }],
    },
  ],
};

const GOOGLE_MAPS_API_KEY = "AIzaSyCbv8TvP1wwaDRT_X01PMsdm13MUidW6aU";

function FallbackView({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="h-[400px] flex items-center justify-center bg-muted/50">
      <div className="text-center space-y-4 p-6">
        <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto" />
        <div className="space-y-2">
          <h3 className="font-semibold">Unable to load map</h3>
          <p className="text-sm text-muted-foreground max-w-[300px]">
            There was a problem loading the map. You can still select locations from the list below.
          </p>
        </div>
        <Button variant="outline" onClick={onRetry} className="mx-auto">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    </div>
  );
}

export function WorldMap({
  agents,
  selectedAgents,
  onAgentSelection,
  isLoading,
}: WorldMapProps) {
  const [hoveredAgent, setHoveredAgent] = useState<string | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [loadError, setLoadError] = useState<boolean>(false);
  const [key, setKey] = useState<number>(0);

  const { isLoaded, loadError: jsApiLoadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const handleRetry = () => {
    setLoadError(false);
    setKey(prev => prev + 1);
  };

  const toggleAgent = (agentId: string) => {
    if (selectedAgents.includes(agentId)) {
      onAgentSelection(selectedAgents.filter(id => id !== agentId));
    } else {
      onAgentSelection([...selectedAgents, agentId]);
    }
  };

  if (isLoading) {
    return <Skeleton className="h-[400px] w-full" />;
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {loadError || jsApiLoadError ? (
          <FallbackView onRetry={handleRetry} />
        ) : !isLoaded ? (
          <Skeleton className="h-[400px] w-full" />
        ) : (
          <GoogleMap
            key={key}
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={2}
            options={options}
            onLoad={onLoad}
            onUnmount={onUnmount}
            onError={() => setLoadError(true)}
          >
            {agents.map((agent) => {
              const [lat, lng] = agent.coordinates.split(",").map(Number);
              return (
                <Marker
                  key={agent.id}
                  position={{ lat, lng }}
                  icon={{
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: selectedAgents.includes(agent.id) ? 8 : 6,
                    fillColor: selectedAgents.includes(agent.id) ? "#3b82f6" : "#6b7280",
                    fillOpacity: 1,
                    strokeWeight: 1,
                    strokeColor: "#fff",
                  }}
                  onClick={() => toggleAgent(agent.id)}
                  onMouseOver={() => setHoveredAgent(agent.id)}
                  onMouseOut={() => setHoveredAgent(null)}
                >
                  {hoveredAgent === agent.id && (
                    <InfoWindow
                      position={{ lat, lng }}
                      onCloseClick={() => setHoveredAgent(null)}
                    >
                      <div className="p-2">
                        <p className="font-medium text-sm">{agent.name}</p>
                        <p className="text-xs text-gray-500">{agent.region}</p>
                      </div>
                    </InfoWindow>
                  )}
                </Marker>
              );
            })}
          </GoogleMap>
        )}
      </CardContent>
    </Card>
  );
}