import { Agent } from "@/lib/types";

export const agentData: Agent[] = [
  // North America
  {
    id: "us-east",
    name: "US East (Virginia)",
    url: "https://us-east.cloudflare-speedtest.com",
    continent: "North America",
    country: "United States",
    region: "East Coast",
    coordinates: "37.7749,-77.3754",
  },
  {
    id: "us-west",
    name: "US West (San Francisco)",
    url: "https://us-west.cloudflare-speedtest.com",
    continent: "North America",
    country: "United States",
    region: "West Coast",
    coordinates: "37.7749,-122.4194",
  },
  // ... Add coordinates for all other locations
  {
    id: "us-central",
    name: "US Central (Dallas)",
    url: "https://us-central.cloudflare-speedtest.com",
    continent: "North America",
    country: "United States",
    region: "Central",
    coordinates: "32.7767,-96.7970",
  },
  {
    id: "eu-west",
    name: "Europe West (London)",
    url: "https://eu-west.cloudflare-speedtest.com",
    continent: "Europe",
    country: "United Kingdom",
    region: "West",
    coordinates: "51.5074,-0.1278",
  },
  {
    id: "eu-central",
    name: "Europe Central (Frankfurt)",
    url: "https://eu-central.cloudflare-speedtest.com",
    continent: "Europe",
    country: "Germany",
    region: "Central",
    coordinates: "50.1109,8.6821",
  },
  {
    id: "ap-east",
    name: "Asia East (Hong Kong)",
    url: "https://ap-east.cloudflare-speedtest.com",
    continent: "Asia",
    country: "China",
    region: "East",
    coordinates: "22.3193,114.1694",
  },
  {
    id: "ap-southeast",
    name: "Asia Southeast (Singapore)",
    url: "https://ap-southeast.cloudflare-speedtest.com",
    continent: "Asia",
    country: "Singapore",
    region: "Southeast",
    coordinates: "1.3521,103.8198",
  },
];