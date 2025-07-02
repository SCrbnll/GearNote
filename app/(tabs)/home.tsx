import VehicleCard from "@/components/VehicleCard";
import { VEHICLES } from "@/constants/vehicles";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const router = useRouter();

  const vehiclesWithPlaceholder = [...VEHICLES];
  if (vehiclesWithPlaceholder.length % 2 !== 0) {
    vehiclesWithPlaceholder.push({
      id: "blank", name: "", plate: "",
      brand: "",
      model: "",
      year: "",
      color: "",
      km_total: "",
      engine: "",
      owner: "",
      technical_sheet: ""
    });
  }

  return (
    <View className="flex-1 bg-ui-body p-5">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-primary text-lg font-bold">MIS VEHÍCULOS</Text>
        <Link href="/maintenance" asChild>
          <TouchableOpacity
            className="bg-primary px-3 py-2 rounded-full flex-row items-center gap-1"
          >
            <Ionicons name="add-circle-outline" size={20} color="black" />
            <Text className="text-black font-semibold mr-2">Agregar</Text>
          </TouchableOpacity>
        </Link>
      </View>

      <FlatList
        data={vehiclesWithPlaceholder}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => {
          if (item.name === "") {
            return <View className="flex-1 m-2 min-w-[45%]" />;
          }

          return (
            <VehicleCard
              id={item.id}
              name={item.name}
              plate={item.plate}
            />
          );
        }}
        contentContainerStyle={{ paddingBottom: 0 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
