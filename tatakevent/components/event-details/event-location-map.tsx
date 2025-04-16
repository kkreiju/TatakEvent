"use client"

import { motion } from "framer-motion"
import { MapPin, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from 'react'

type EventLocationMapProps = {
  location: string
  address: string
}

type Coordinates = {
  lat: number;
  lon: number;
};

export default function EventLocationMap({ location, address }: EventLocationMapProps) {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const osmUrl = `https://www.openstreetmap.org/search?query=${encodeURIComponent(address)}`;

  useEffect(() => {
    // Fetch coordinates using Nominatim
    const fetchCoordinates = async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
        );
        const data = await response.json();
        if (data && data[0]) {
          setCoordinates({
            lat: parseFloat(data[0].lat),
            lon: parseFloat(data[0].lon)
          });
        }
      } catch (error) {
        console.error('Error fetching coordinates:', error);
      }
    };

    fetchCoordinates();
  }, [address]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mt-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900/30">
          <MapPin className="h-6 w-6 text-yellow-500" />
        </div>
        <h2 className="text-2xl font-bold">Event Location</h2>
      </div>
      <div className="bg-background rounded-xl overflow-hidden shadow-sm border">
        <div className="aspect-video w-full relative">
          {coordinates ? (
            <iframe
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${coordinates.lon-0.01},${coordinates.lat-0.01},${coordinates.lon+0.01},${coordinates.lat+0.01}&layer=mapnik&marker=${coordinates.lat},${coordinates.lon}`}
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-8 w-8 mx-auto mb-2 text-muted-foreground animate-pulse" />
                <p className="text-sm text-muted-foreground">Loading map...</p>
              </div>
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold mb-1">{location}</h3>
              <p className="text-muted-foreground text-sm">{address}</p>
            </div>
            <Button asChild variant="outline" size="sm">
              <a href={osmUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                View on OpenStreetMap
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
