import { Component, createEffect, onCleanup, onMount } from 'solid-js';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

type Vehicle = {
  name: string;
  id: number;
  latitude: number;
  longitude: number;
};

interface VehicleMapProps {
  vehicles: Vehicle[];
  onVehicleClick: (vehicleId: number) => void;
}

const getAverageCoordinates = (vehicles: Vehicle[]): [number, number] => {
  if (vehicles.length === 0) return [0, 0];

  const total = vehicles.reduce((acc, vehicle) => {
    acc.lat += vehicle.latitude;
    acc.lon += vehicle.longitude;
    return acc;
  }, { lat: 0, lon: 0 });

  return [total.lat / vehicles.length, total.lon / vehicles.length];
}

const VehicleMap: Component<VehicleMapProps> = (props) => {
  let mapContainer: HTMLDivElement | undefined;
  let map: L.Map | undefined;
  let markersMap: Map<number, L.Marker> = new Map();

  onMount(() => {
    if (mapContainer) {
      map = L.map(mapContainer).setView(getAverageCoordinates(props.vehicles), 15);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);
    }
  });

  createEffect(() => {
    if (!map) return;

    markersMap.forEach((marker) => {
      marker.remove();
    });
    markersMap.clear();

    props.vehicles.forEach(vehicle => {
      if (!map) {
        return;
      }

      const marker = L.marker([vehicle.latitude, vehicle.longitude], {
        title: vehicle.name
      }).addTo(map);

      marker.bindTooltip(vehicle.name, { permanent: true });
      marker.on('click', () => {
        props.onVehicleClick(vehicle.id);
        if (map) {
          map.setView([vehicle.latitude, vehicle.longitude], map.getZoom());
        }
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
