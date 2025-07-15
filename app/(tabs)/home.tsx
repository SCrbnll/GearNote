import VehicleCard from "@/components/Card/VehicleCard";
import AppHeader from "@/components/Header/AppHeader";
import { Vehicle } from "@/types/type-db";
import { getAllVehicles } from "@/utils/database";
import { Ionicons } from "@expo/vector-icons";
import { Link, useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, Text, View } from "react-native";


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
            <View className="flex-row items-center">
              <Ionicons name="home-sharp" size={20} color="#FFFFFF" />
              <Text className="text-white text-lg font-bold ml-3">Mi garaje</Text>
            </View>
            <Link href="/(vehicle)/create" asChild>
              <Ionicons name="add-circle" size={20} color="#FFFFFF" />
            </Link>
          </View>
          <View className="border-b-2 border-gray mb-3"></View>

          <FlatList
            data={vehicles}
            keyExtractor={(item) => item.id?.toString() ?? Math.random().toString()}
            renderItem={({ item }) => (
                <VehicleCard
                  id={item.id?.toString() ?? ""}
                  name={item.name}
                  plate={item.plate}
                />
              )
            }
            ListEmptyComponent={
              <View className="mt-10 items-center">
                <Ionicons name="car-outline" size={40} color="#FE9525" />
                <Text className="text-primary text-sm mt-2 text-center">
                  No hay vehiculos registrados
                </Text>
              </View>
            }
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
  );
}
