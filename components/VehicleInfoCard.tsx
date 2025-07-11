import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { View } from "react-native";
import InfoRow from "./InfoRow";

type Props = {
  vehicle: any;
};

export default function VehicleInfoCard({ vehicle }: Props) {
  return (
    <View className="bg-background-secondary rounded-xl p-4">
      <InfoRow
        label="Matrícula"
        value={vehicle.plate}
        icon={<Ionicons name="car" size={16} color="#FE9525" />}
      />
      <InfoRow
        label="Motor"
        value={`${vehicle.engine}`}
        icon={<FontAwesome5 name="oil-can" size={14} color="#FE9525" />}
      />
      <InfoRow
        label="Color"
        value={vehicle.color}
        icon={<Ionicons name="color-palette" size={16} color="#FE9525" />}
      />
      <InfoRow
        label="Kilómetros"
        value={`${vehicle.km_total} km`}
        icon={<MaterialIcons name="speed" size={16} color="#FE9525" />}
      />
    </View>
  );
}
