import { Vehicle } from "@/types/type-db";
import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { View } from "react-native";
import InfoRow from "./InfoRow";

type Props = {
  vehicle: Vehicle;
};

export default function VehicleInfoCard({ vehicle }: Props) {
  return (
    <View className="bg-background-secondary rounded-xl p-2">
      <InfoRow
        label="Kilómetros"
        value={
          vehicle.km_total >= 1000
            ? `${vehicle.km_total.toLocaleString("es-AR")} km`
            : `${vehicle.km_total} km`
        }
        icon={<MaterialIcons name="speed" size={16} color="#FE9525" />}
      />
      <InfoRow
        label="Combustible"
        value={vehicle.fuel ? vehicle.fuel : "No especificado"}
        icon={<Ionicons name="leaf" size={16} color="#FE9525" />}
      />

      <InfoRow
        label="Motor"
        value={`${vehicle.engine}`}
        icon={<FontAwesome5 name="oil-can" size={14} color="#FE9525" />}
      />
      <InfoRow
        label="Matrícula"
        value={vehicle.plate}
        icon={<Ionicons name="car" size={16} color="#FE9525" />}
      />
      <InfoRow
        label="ITV"
        value={vehicle.itv ? vehicle.itv : "Sin ITV"}
        icon={<Ionicons name="calendar" size={16} color="#FE9525" />}
      />
      <InfoRow
        label="Distintivo ambiental"
        value={vehicle.eco_label ? vehicle.eco_label : "No especificado"}
        icon={<Ionicons name="medal" size={16} color="#FE9525" />}
      />
      <InfoRow
        label="Color"
        value={vehicle.color ? vehicle.color : "No especificado"}
        icon={<Ionicons name="color-palette" size={16} color="#FE9525" />}
      />
    </View>
  );
}
