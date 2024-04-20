import { Title } from "@solidjs/meta";
import VehicleMap from "~/components/VehicleMap/VehicleMap";

export default function Home() {
  const vehicles = [
    { name: 'Vehicle A', id: '1', latitude: 35.6895, longitude: 139.6917 },
    { name: 'Vehicle B', id: '2', latitude: 34.0522, longitude: -118.2437 },
  ];

  const handleVehicleClick = (id: string) => {
    console.log(`Vehicle clicked: ${id}`);
  };
  return (
    <main>
      <Title>Map</Title>
      <h1>Map</h1>

      <VehicleMap vehicles={vehicles} onVehicleClick={handleVehicleClick} />
    </main>
  );
}
