import AppHeader from "@/components/Header/AppHeader";
import VehicleCard from "@/components/VehicleCard";
import { Vehicle } from "@/types/type-db";
import { getAllVehicles } from "@/utils/database";
import { Ionicons } from "@expo/vector-icons";
import { Link, useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";


export default function HomeScreen() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const router = useRouter();

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

  return (
    <View className="flex-1 bg-ui-body">
      <AppHeader
        type="home"
        title="GearNote"
        rightIcon={<Ionicons name="settings" size={20} color="#B0B0B0" />}
        onRightPress={() => router.push("/(tabs)/settings")}
      />
      <View className="p-5">
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
            data={vehicles}
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
      </View>
  );
}
