"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import L, { LatLngTuple } from "leaflet";
import { getCoordinates } from "@/redux/TravelSlice/TravelSlice";
import turfDistance from "@turf/distance";
import { point } from "@turf/helpers";

type Props = {
  destinations: {
    destination: string;
    activities: { activity: string }[];
  }[];
  onDistanceCalculated: (distances: string[]) => void;
  onPinLocation: (location: string) => void;
};

const MapComponent: React.FC<Props> = ({
  destinations,
  onDistanceCalculated,
  onPinLocation,
}) => {
  const [markers, setMarkers] = useState<
    { position: LatLngTuple; name: string }[]
  >([]);
  const [distances, setDistances] = useState<string[]>([]);
  const [newdestination, setNewDestination] = useState<string>("");

  const [manualMarkers, setManualMarkers] = useState<
    { position: LatLngTuple; name: string }[]
  >([]);

  useEffect(() => {
    const fetchCoordinates = async () => {
      const coords = await Promise.all(
        destinations.map(async (dest) => {
          const coordinates = await getCoordinates(dest.destination);
          return coordinates
            ? {
                position: [coordinates.lat, coordinates.lng] as LatLngTuple,
                name: dest.destination,
              }
            : null;
        })
      );
      setMarkers(
        coords.filter(
          (marker): marker is { position: LatLngTuple; name: string } =>
            marker !== null
        )
      );
    };

    fetchCoordinates();
  }, [destinations]);

  useEffect(() => {
    if (markers.length + manualMarkers.length > 1) {
      const allMarkers = [...markers, ...manualMarkers];
      const calculatedDistances = allMarkers
        .map((marker, index) => {
          if (index === allMarkers.length - 1) return null;
          const distance = turfDistance(
            point([marker.position[1], marker.position[0]]),
            point([
              allMarkers[index + 1].position[1],
              allMarkers[index + 1].position[0],
            ]),
            { units: "kilometers" }
          );
          return `${marker.name} to ${
            allMarkers[index + 1].name
          }: ${distance.toFixed(2)} km`;
        })
        .filter(Boolean) as string[];
      setDistances(calculatedDistances);
      onDistanceCalculated(calculatedDistances);
    }
  }, [markers, manualMarkers, onDistanceCalculated]);

  // Custom hook to handle map clicks
  const MapClickHandler = () => {
    const map = useMap();

    const handleMapClick = async (event: L.LeafletMouseEvent) => {
      const { lat, lng } = event.latlng;
      const newMarkerPosition: LatLngTuple = [lat, lng];

      // Get place name from coordinates using Nominatim
      const placeName = await getPlaceName(lat, lng);
      onPinLocation(placeName);
      setNewDestination(placeName);
      const newMarker = {
        position: newMarkerPosition,
        name: placeName || `Manual Marker ${manualMarkers.length + 1}`,
      };
      setManualMarkers((prev) => [...prev, newMarker]);
    };

    const getPlaceName = async (lat: number, lng: number) => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
        );
        const data = await response.json();
        return data.display_name;
      } catch (error) {
        console.error("Error fetching place name:", error);
        return null;
      }
    };

    useEffect(() => {
      map.on("click", handleMapClick);

      return () => {
        map.off("click", handleMapClick);
      };
    }, [map, manualMarkers]);

    return null;
  };

  const position: LatLngTuple =
    markers.length > 0 ? markers[0].position : [20, 78];
  const zoom = 5;

  return (
    <MapContainer
      center={position}
      zoom={zoom}
      style={{ height: "95vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {[...markers, ...manualMarkers].map((marker, index) => (
        <Marker
          key={index}
          position={marker.position}
          icon={new L.Icon.Default()}
        >
          <Tooltip>{marker.name}</Tooltip>
        </Marker>
      ))}
      {markers.length + manualMarkers.length > 1 && (
        <Polyline
          positions={[...markers, ...manualMarkers].map(
            (marker) => marker.position
          )}
          color="blue"
          weight={4}
          opacity={0.7}
        />
      )}
      <MapClickHandler />
    </MapContainer>
  );
};

// Use dynamic import to avoid SSR
/* export default dynamic(() => Promise.resolve(MapComponent), { ssr: false }); */
export default MapComponent;
