import { Title } from "@solidjs/meta";
import { createEffect, createSignal, onCleanup } from "solid-js";
import VehicleMap from "~/components/VehicleMap/VehicleMap";

export default function Home() {
  const [selectedVehicle, setSelectedVehicle] = createSignal<number | null>(null);
  const [vehicles, setVehicles] = createSignal([
    { name: 'Vehicle A', id: 1, latitude: -6.92156, longitude: 107.61096 },
    { name: 'Vehicle B', id: 2, latitude: -6.92095, longitude: 107.61189 },
  ]);

  createEffect(() => {
    const interval = setInterval(() => {
      setVehicles((vehicles) => {
        return vehicles.map((vehicle) => {
          const latChange = (Math.random() - 0.5) * 0.001;
          const lngChange = (Math.random() - 0.5) * 0.001;

          return {
            ...vehicle,
            latitude: vehicle.latitude + latChange,
            longitude: vehicle.longitude + lngChange,
          };
        });
      });
    }, 2000);

    onCleanup(() => {
      clearInterval(interval);
    });
  });

  const handleVehicleClick = (id: number) => {
    console.log(`Vehicle clicked: ${id}`);
    setSelectedVehicle(id);
  };

  return (
    <main>
      <Title>Map</Title>
      <h1>Map</h1>
      <VehicleMap vehicles={vehicles()} onVehicleClick={handleVehicleClick} />
      <span>Selected vehicle: {selectedVehicle()}</span>
    </main>
  );
}
