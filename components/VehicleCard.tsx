import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Text, TouchableOpacity } from "react-native";

type VehicleCardProps = {
  id: string;
  name: string;
  plate: string;
};

export default function VehicleCard({
  id,
  name,
  plate,
}: VehicleCardProps) {
  return (
    <Link href={{ pathname: "/(vehicle)/[id]", params: { id } }} asChild>
      <TouchableOpacity
        className="bg-ui-card p-4 rounded-2xl m-2 flex-1 min-w-[45%]"
        activeOpacity={0.8}
      >
        <Ionicons name="car-sport" size={32} color="#d1d5db" />
        <Text className="text-primary font-semibold mt-2">{name}</Text>
        <Text className="text-secondary">{plate}</Text>
      </TouchableOpacity>
    </Link>
  );
}
