import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

type VehicleCardProps = {
  name: string;
  plate: string;
};

export default function VehicleCard({ name, plate }: VehicleCardProps) {
  return (
    <View className="bg-ui-card p-4 rounded-2xl m-2 flex-1 min-w-[45%]">
      <Ionicons name="car-sport" size={32} color="#d1d5db" />
      <Text className="text-primary font-semibold mt-2">{name}</Text>
      <Text className="text-secondary">{plate}</Text>
    </View>
  );
}
