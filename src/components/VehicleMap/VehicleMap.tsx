import { createEffect, onCleanup, onMount } from 'solid-js';
import type { Marker } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

type Vehicle = {
  name: string;
  id: string;
  latitude: number;
  longitude: number;
};

interface VehicleMapProps {
  vehicles: Vehicle[];
  onVehicleClick: (vehicleId: string) => void;
}

const VehicleMap = (props: VehicleMapProps) => {
  let mapContainer: HTMLDivElement | undefined;
  let map: L.Map | null;
  let markersMap: Map<string, Marker> = new Map();

  onMount(() => {
    if (!mapContainer) return;
    map = L.map(mapContainer).setView([0, 0], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
  });

  createEffect(() => {
    if (!map) return; // Ensure map is initialized

    // Clear existing markers
    markersMap.forEach((marker) => {
      marker.remove();
    });
    markersMap.clear();

    // Add new markers
    props.vehicles.forEach(vehicle => {
      const marker = L.marker([vehicle.latitude, vehicle.longitude], {
        title: vehicle.name
      }).addTo(map);

      marker.bindTooltip(vehicle.name, { permanent: true });
      marker.on('click', () => {
        props.onVehicleClick(vehicle.id);
        map.setView([vehicle.latitude, vehicle.longitude], map.getZoom());
      });

      markersMap.set(vehicle.id, marker);
    });
  });

  onCleanup(() => {
    map?.remove();
  });

  return <div ref={mapContainer} style={{ height: '500px', width: '100%' }}></div>;
};

export default VehicleMap;
