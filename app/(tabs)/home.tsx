import VehicleCard from "@/components/VehicleCard";
import { getAllVehicles } from "@/utils/database";
import { Ionicons } from "@expo/vector-icons";
import { Link, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";


export default function HomeScreen() {
  const [vehicles, setVehicles] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      const fetchVehicles = async () => {
        try {
          const data = await getAllVehicles();
          setVehicles(data);
        } catch (err) {
          console.error("Error al obtener vehículos:", err);
        }
      };

      fetchVehicles();
    }, [])
  );

  const vehiclesWithPlaceholder = [...vehicles];
  if (vehiclesWithPlaceholder.length % 2 !== 0) {
    vehiclesWithPlaceholder.push({
      id: -1, // clave única ficticia
      name: "",
      plate: "",
      brand: "",
      model: "",
      year: 0,
      color: "",
      km_total: 0,
      engine: "",
      technical_sheet: "",
      additional_info: "",
    });
  }

  return (
    <View className="flex-1 bg-ui-body p-5">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-primary text-lg font-bold">MIS VEHÍCULOS</Text>
        <Link href="/(vehicle)/create" asChild>
          <TouchableOpacity className="bg-primary px-3 py-1 rounded-full flex-row items-center gap-1">
            <Ionicons name="add-circle-outline" size={20} color="black" />
            <Text className="text-black font-semibold mr-2">Agregar</Text>
          </TouchableOpacity>
        </Link>
      </View>

      <FlatList
        data={vehiclesWithPlaceholder}
        keyExtractor={(item) => item.id?.toString() ?? Math.random().toString()}
        numColumns={2}
        renderItem={({ item }) => {
          if (item.name === "") {
            return <View className="flex-1 m-2 min-w-[45%]" />;
          }

          return (
            <VehicleCard
              id={item.id?.toString() ?? ""}
              name={item.name}
              plate={item.plate}
            />
          );
        }}
        contentContainerStyle={{ paddingBottom: 0 }}
        showsVerticalScrollIndicator={false}
         ListEmptyComponent={
          <View className="mt-10 items-center">
            <Ionicons name="car-outline" size={40} color="#FE9525" />
            <Text className="text-primary text-sm mt-2 text-center">
              No hay vehiculos registrados
            </Text>
          </View>
        }
      />
    </View>
  );
}
